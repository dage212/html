(function ($w) {
    'use strict';
    $w.DrawRelation = function (graph, wrapperId, newCount, options) {
        this.graph = graph;
        this.data = {
            nodes: [],
            links: []
        };
        this.wrapperId = wrapperId;  // 用于画图的容器id
        this.$wrapper = $('#' + wrapperId);
        this.w = this.$wrapper.width();
        this.h = this.$wrapper.height();
        this.newCount = newCount || 0;  // 用于记录织关系的次数（织关系目前已去掉）
        this.defaultOptions = {
            legend: true,  // 是否放图例
            filter: true,  // 是否加 筛选节点的功能
            pulse: true,  // 是否加脉冲
            weaveNewBtn: false,  // 是否加 织关系 按钮（目前已去掉）
            lineTextField: 'name',  // 设置关系线的文字字段
            allRelationTypeMap: {  // 所有的关系映射（包括class控制关系线的样式、needShow是否需要显示，needPulse是否需要脉冲）
                '法定代表': {
                    class: 'legal',
                    needShow: true,
                    needPulse: false
                }, '投资': {
                    class: 'invest',
                    needShow: true,
                    needPulse: true
                }, '任职': {
                    class: 'others',
                    needShow: true,
                    needPulse: false
                }, '分支机构': {
                    class: 'branch',
                    needShow: true,
                    needPulse: false
                },'交易': {
                    class: 'trade',
                    needShow: false,
                    needPulse: true
                },'担保': {
                    class: 'guarantee',
                    needShow: false,
                    needPulse: true
                },'借款': {
                    class: 'loan',
                    needShow: false,
                    needPulse: true
                },'风险': {
                    class: 'risk',
                    needShow: false,
                    needPulse: true
                }
            },
            defaultRelationType: '分支机构',  // 若映射关系不成功，则放在归为此默认关系
            nodeRadius: {  // 不同节点类型及脉冲的大小
                person: 25,
                company: 35,
                main: 50,
                pulse: 4
            },
            nodeTypeMap: {
                'main': ['#499FFF', '#4ACEFF', '查找对象'],   // 不同节点类型的颜色渐变
                'company': ['#3FCDC5', '#48E7B5', '企业'],
                'person': ['#FF9751', '#FFB04A', '自然人']
            },
            fixNode: true,  // 是否需要固定某些节点
            fixField: { // 若fixNode = true时，则固定符合以下情况的节点
                'main': true,
                'isController': true
            },
            fixTotal: 0,
            splitAxiX: {  // 根据需要固定节点的个数而确定摆放的位置
                1: [7/12],
                2: [4/12, 9/12],
                3: [3/12, 6/12, 9/12],
                4: [2/12, 5/12, 8/12, 11/12]
            }
        };
        this.options = $.extend({}, this.defaultOptions, options);
        //console.log(this.options)
    };

    $w.DrawRelation.prototype = {
        _inteRelationList: function () { // 合并两个节点之间相同的关系
            var _this = this;
            var sour2TarWithType = {},
                inteRelationArr = [];
            $.each(this.graph.relationList, function (i, link) {
                if(!_this.options.allRelationTypeMap[link.relationType]) link.relationType = _this.options.defaultRelationType;  // 若link的relationType不在8种里，则归为默认的关系
                var key = link.sourceEntity + '_' + link.targetEntity + link.relationType;
                if(sour2TarWithType[key] !== undefined) {
                    var currInteRelationItem = inteRelationArr[sour2TarWithType[key]];
                    currInteRelationItem.name = currInteRelationItem.name + ', ' + link.name;
                    currInteRelationItem.amount = Number(currInteRelationItem.amount) + Number(link.amount);
                } else {
                    inteRelationArr.push(link);
                    sour2TarWithType[key] = inteRelationArr.length - 1;
                }
            });
            this.graph.relationList = inteRelationArr;
            //console.log(this.graph.relationList, sour2TarWithType)
        },
        _formatData: function () {  // 过滤并格式化node、list、
            this._inteRelationList();
            this.data = {
                nodes: [],
                links: []
            };
            this.options.fixTotal = 0;

            // 过滤掉不符合条件的node及相应的link
            var nodeListUniq = [],  // 盛放过滤后的nodes
                nodeListUniqCheck = {};
            $.each(this.graph.nodeList, function (i, node) {
                // 过滤掉非主企业且不含在营、迁出的字段
                if(node.entityType.toUpperCase() === 'COMPANY' && !node.main && !/(在营)|(迁出)/.test(node.entityStatus)) {
                    // do nothing
                } else {
                    nodeListUniq.push(node);
                    nodeListUniqCheck[node.id] = 1;
                }
            });
            var linkListUniq = []; // 盛饭过滤后的links
            // 过滤掉source、target都不存在的关系link
            $.each(this.graph.relationList, function (i, link) {
                if(nodeListUniqCheck[link.sourceEntity] && nodeListUniqCheck[link.targetEntity]) {
                    linkListUniq.push(link);
                }
            });

            // 将data.link.source、data.link.target，data.node.downstream、data.node.upstream都用index来表示
            // 并记录isMain的个数
            var nodeList = nodeListUniq,
                relationList = linkListUniq;
            var nodeIndexJson = {};   // 用来记录node的下表 index
            var _this = this;
            $.each(nodeList, function (i, node) {
                var nodeItem = {
                    id: node.id,
                    name: node.entityName,
                    nodeType: node.entityType.toLowerCase(),
                    upstream: [],
                    downstream: []
                };
                if(node.main) {
                    nodeItem.nodeType = 'main';
                }

                $.each(_this.options.fixField, function (key, value) {
                    if(node[key] === value && !nodeItem.fixCount) {
                        nodeItem.fixCount = ++_this.options.fixTotal;
                    }
                });


                _this.data.nodes.push(nodeItem);


                nodeIndexJson[node.id] = {
                    index: i,
                    id: node.id,
                    name: nodeList[i].entityName,
                    nodeType: node.entityType
                }
            });
            var relationType = '',
                allRelationTypeMap = this.options.allRelationTypeMap;
            $.each(relationList, function (i, link) {
                relationType = allRelationTypeMap[link.relationType];
                // 初始化需要展现的关系种类
                if(!allRelationTypeMap[link.relationType].needShow) {
                    allRelationTypeMap[link.relationType].needShow = true;
                }
                //console.log(nodeIndexJson, link)
                var sourceIndex = nodeIndexJson[link.sourceEntity].index,
                    targetIndex = nodeIndexJson[link.targetEntity].index;
                _this.data.nodes[targetIndex].upstream.push(sourceIndex);
                _this.data.nodes[sourceIndex].downstream.push(targetIndex);

                var linkItem = {
                    source: sourceIndex,
                    target: targetIndex,
                    relationType: relationType.class,
                    relationTypeChinese: link.relationType,
                    name: link.name,
                    amount: Number(link.amount)
                };
                if(linkItem[_this.options.lineTextField] === undefined) linkItem[_this.options.lineTextField] = link[_this.options.lineTextField];
                _this.data.links.push(linkItem);
            });

            var linkNumJson = {}; // 用来记录 A、B节点之间的关系条数
            $.each(this.data.links, function (i, link) {
                var sourceNum = Number(link.source),
                    targetNum = Number(link.target);
                var name = '' + Math.min(sourceNum, targetNum) + '-' + Math.max(sourceNum, targetNum);
                if(linkNumJson[name]) {
                    link.num = linkNumJson[name];
                    linkNumJson[name] += 1;
                } else {
                    link.num = 0;
                    linkNumJson[name] = 1;
                }
            });
            //console.log(this.data)

        },
        _initForce: function () { // 初始化立场关系
            return d3.layout.force()
                .nodes(this.data.nodes)
                .links(this.data.links)
                .charge(-3000)
                //.gravity(.05)
                .linkDistance(160)
                .size([this.w, this.h])
        },
        _getSize: function (zoomG) {  // 获得某个元素的位置属性
            var scale = 1,
                translate = [0, 0];

            var transform = zoomG.attr('transform');
            if(transform && transform.indexOf(')') !== -1) {
                transform = transform.split(')');
                for(var i = 0; i < transform.length; i++) {
                    if(transform[i].indexOf('scale(') !== -1) {
                        scale = transform[i].substring(transform[i].indexOf('scale(') + 6);
                    } else if(transform[i].indexOf('translate(') !== -1) {
                        var currTranslate = transform[i].substring(transform[i].indexOf('translate(') + 10);
                        if(currTranslate.indexOf('\,') !== -1) {
                            currTranslate = currTranslate.split('\,');
                        } else {
                            currTranslate = currTranslate.split(' ');
                        }
                        translate[0] += parseFloat(currTranslate[0]) || 0;
                        translate[1] += parseFloat(currTranslate[1]) || 0;
                    }
                }
            }

            var width, height;
            var x, y;
            zoomG.each(function(d) {
                width = this.getBBox().width;
                height = this.getBBox().height;
                x = this.getBBox().x;
                y = this.getBBox().y;
            });
            return {translate: translate, scale: parseFloat(scale), width: width, height: height, x: x, y: y};
        },
        _getBBox: function (selection) {  // 获取元素的盒信息
            selection.each(function (d) {
                d.bbox = this.getBBox();
            })
        },
        _calculateEndpointPos: function (d, sourceMargin, targetMargin) {  // 计算起始位置（用于关系线、脉冲路径的起始位置）
            sourceMargin = sourceMargin || 0;
            targetMargin = targetMargin || 0;
            sourceMargin -= d.num * 3;
            targetMargin -= d.num * 3;
            var deltaX = d.target.x - d.source.x,
                deltaY = d.target.y - d.source.y,
                dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
                normX = deltaX / dist,
                normY = deltaY / dist,

                sourcePadding = this.options.nodeRadius[d.source.nodeType] + sourceMargin,
                targetPadding = this.options.nodeRadius[d.target.nodeType] + targetMargin,
                sourceX = d.source.x + sourcePadding * normX,
                sourceY = d.source.y + sourcePadding * normY,
                targetX = d.target.x - targetPadding * normX,
                targetY = d.target.y - targetPadding * normY;

            var angle = Math.atan(deltaY / deltaX),
                multiple = Math.ceil(d.num / 2);

            if(d.num % 2) {
                sourceX = sourceX - multiple * 12 * Math.sin(angle);  // 12代表平行两线的距离
                sourceY = sourceY + multiple * 12 * Math.cos(angle);
                targetX = targetX - multiple * 12 * Math.sin(angle);
                targetY = targetY + multiple * 12 * Math.cos(angle);
            } else {
                sourceX = sourceX + multiple * 12 * Math.sin(angle);
                sourceY = sourceY - multiple * 12 * Math.cos(angle);
                targetX = targetX + multiple * 12 * Math.sin(angle);
                targetY = targetY - multiple * 12 * Math.cos(angle);
            }
            return {sourceX: sourceX, sourceY: sourceY, targetX: targetX, targetY: targetY};
        },
        _splitText: function (text) {  // 将一段文本切开，用于分行展示节点上的文字
            var arr = [];
            var line = 0;
            var numJson = {
                1: [1],
                2: [2],
                3: [3],
                4: [4],
                5: [2, 3],
                6: [3, 3],
                7: [3, 4],
                8: [4, 4],
                9: [4, 5],
                10: [3, 4, 3],
                11: [3, 5, 3],
                12: [4, 4, 4],
                13: [4, 5, 4],
                14: [4, 5, 6],
                15: [4, 5, 6]
            };
            if(text.length > 13) text = text.substring(0, 12) + '...';
            var textLength = text.length;
            line = numJson[textLength].length;
            if(line <= 1) {
                arr.push(text);
            } else if(line <= 2) {
                arr.push(text.substring(0, numJson[textLength][0]));
                arr.push(text.substring(numJson[textLength][0]));
            } else if(line <= 3) {
                arr.push(text.substring(0, numJson[textLength][0]));
                arr.push(text.substring(numJson[textLength][0], numJson[textLength][0] + numJson[textLength][1]));
                arr.push(text.substring(numJson[textLength][0] + numJson[textLength][1]));
            }
            return {line: line, arr: arr};
        },
        _tick: function (link, linkText, node, pulseDot) {  // 立场图调节位置时每帧设置
            var _this = this;

            return function () {
                node.attr('transform', function (d) {
                    if(_this.options.fixNode && d.fixCount && _this.options.fixTotal <= 4) {
                        d.py = 1/2 * _this.h;
                        d.y = 1/2 * _this.h;
                        var rate = _this.options.splitAxiX[_this.options.fixTotal][d.fixCount - 1]
                        d.px = rate * _this.w;
                        d.x = rate * _this.w;

                    }
                    return "translate("+d.x+"," + d.y + ")";
                });
                link.attr('d', function (d) {
                    var posD = _this._calculateEndpointPos(d);
                    return 'M' + posD.sourceX + ',' + posD.sourceY + 'L' + posD.targetX + ',' + posD.targetY;
                });
                linkText.attr("transform", function (d) {  // 关系的位置
                    var posD = _this._calculateEndpointPos(d);
                    return "translate(" + (posD.targetX + posD.sourceX)/2 + "," + (posD.targetY + posD.sourceY)/2 + ")" + " rotate(" + Math.atan((d.target.y - d.source.y) / (d.target.x - d.source.x)) * 180 / Math.PI + ")";
                });
                if(pulseDot) {
                    pulseDot.attr('cx', function(d) {
                        return d.source.x;
                    }).attr('cy', function (d) {
                        return d.source.y;
                    });
                }

            }

        },
        _defineMaker: function (zoomG) {  // 箭头样式
            var _this = this;
            zoomG.append("defs").selectAll("marker")
                .data((function () {
                    var arr = [];
                    for(var key in _this.options.allRelationTypeMap) {
                        arr.push(_this.options.allRelationTypeMap[key].class);
                    }
                    return arr;
                })())
                .enter().append("marker")
                .attr("id", function(d) {
                    return d + '_maker';
                })
                .attr("viewBox", "0 -4 8 10")
                .attr("refX", 9)
                .attr("refY", 0)
                .attr("markerWidth", 5)
                .attr("markerHeight", 5)
                .attr("orient", "auto")
                .append("path")
                .attr("d", "M0,-4L10,0L0,4");
        },
        _defineGradient: function (zoomG) {  // 节点渐变样式
            var _this = this;
            var defs_gradient = zoomG.append('defs').selectAll('linearGradient')
                .data((function () {
                    var arr = [];
                    for(var key in _this.options.nodeTypeMap) {
                        arr.push(key);
                    }
                    return arr;
                })())
                .enter().append('linearGradient')
                .attr('id', function (d) {
                    return d + '_gradient';
                })
                .attr('x1', '0%')
                .attr('y1', '100%')
                .attr('x2', '100%')
                .attr('y2', '0%');
            defs_gradient.append('svg:stop')
                .attr('offset', '0%')
                .style('stop-color', function (d) {
                    return _this.options.nodeTypeMap[d][0];
                });
            defs_gradient.append('svg:stop')
                .attr('offset', '100%')
                .style('stop-color', function (d) {
                    return _this.options.nodeTypeMap[d][1];
                });
        },
        _zoom: function (zoomG) {  // 拖动图时移动
            var _this = this;
            var zoom = d3.behavior.zoom().scaleExtent([.6, 10]);
            zoom.on('zoom', function () {
                var currGetSize = _this._getSize(zoomG);
                if(d3.event.sourceEvent.type !== 'wheel' && d3.event.sourceEvent.type !== 'mousewheel') zoomG.attr("transform", "translate(" + currGetSize.width/2 + ", " + currGetSize.height/2 + ")translate(" + d3.event.translate + ")scale(" + currGetSize.scale + ")translate(-" + currGetSize.width/2 + ", -" + currGetSize.height/2 + ")");
            });
        },
        _pan: function (zoomG) {  // 拖动图之外但svg之内时，平移
            var _this = this;
            var svg_drag = d3.behavior.drag()
                .on('dragstart', function (d, i) {

                })
                .on('drag', function (d, i) {
                    var currGetSize = _this._getSize(zoomG);
                    zoomG.attr("transform", "translate(" + currGetSize.width/2 + ", " + currGetSize.height/2 + ")translate(" + (currGetSize.translate[0] + d3.event.dx) + ',' + (currGetSize.translate[1] + d3.event.dy) + ")scale(" + currGetSize.scale + ")translate(-" + currGetSize.width/2 + ", -" + currGetSize.height/2 + ")");
                })
                .on('dragend', function (d, i) {

                });
            return svg_drag;
        },
        _appendSvg: function () {  // 在容器中添加 svg 并添加事件
            var svg = d3.select('#' + this.wrapperId)
                .html('').append("svg")
                .attr('class', 'd3-container')
                .attr("width", this.w)
                .attr("height", this.h)
                .on('dblclick.zoom', null)
                .style("cursor","move");
            return svg;
        },
        _appendZoomG: function (svg) {  // 在svg中添加g标签，用于包裹子标签
            return svg.append('g')
                .style('transform-origin', 'center');
        },
        _appendLink: function (zoomG) {  // 画线
            var _this = this;
            //定义连线
            var link = zoomG.selectAll(".link")
                .data(this.data.links)
                .enter()
                .append("path")
                .attr("class", function (d) {
                    return "link " + d.relationType;
                })
                .attr("marker-end", function(d) { return "url(#" + d.relationType + "_maker)"; });

            return link;
        },
        _appendLinkText: function (zoomG) {  // 写关系的文字
            var _this = this;
            var linkText = zoomG.selectAll('.linkText')
                .data(this.data.links)
                .enter().append("svg:g")
                .attr("class", "linkText");
            linkText.append("svg:text")
            //.attr("x", 8)
                .attr("y", ".31em")
                .attr('text-anchor', "middle")
                .text(function (d) {
                    return d[_this.options.lineTextField];
                })
                .call(this._getBBox);
            linkText.insert('rect', 'text')
                .attr('width', function(d) {
                    return d.bbox.width;
                })
                .attr('height', function (d) {
                    return d.bbox.height - 4;
                })
                .attr("y", "-.6em")
                .attr('x', function (d) {
                    return -d.bbox.width / 2;
                })
                .style('fill', '#eff4f5');
            return linkText;
        },
        _appendNode: function (zoomG) { // 加节点（画圆、写文字）
            var _this = this;
            //定义节点标记
            var node = zoomG.selectAll(".node")
                .data(this.data.nodes)
                .enter()
                .append("g")
                .on('mousedown', function () {
                    d3.event.stopPropagation();
                })
                .on('dblclick.zoom', function () {
                    d3.event.stopPropagation();
                });
            node.append("circle")
                .attr("r",function(d) {
                    return _this.options.nodeRadius[d.nodeType];
                })
                .attr('fill', function (d) {
                    return 'url(#' + d.nodeType + '_gradient)';
                });
            //节点上显示的姓名
            node.append('text')
                .attr('y', function(d) {     // 文字上移
                    var lines = _this._splitText(d.name).line;
                    return -(lines * 9);
                })
                .style('alignment-baseline', 'middle')
                .selectAll('tspan')
                .data(function(d) {
                    return _this._splitText(d.name).arr;
                })
                .enter().append('tspan')
                .attr('x', 0)
                .attr("dy", "1.1em")
                .attr("class","nodeText")
                .style("text-anchor", "middle")
                .style('alignment-baseline', 'middle')
                .text(function(d, i) {
                    return d
                });
            return node;
        },
        _appendPulse: function (zoomG, pulseFlags) {
            var _this = this;
            var pulseDot = zoomG.selectAll('.pulseDot')
                .data(function() {
                    var arr = [];
                    $.each(_this.data.links, function (i, link) {
                        if(_this.options.allRelationTypeMap[link.relationTypeChinese].needPulse) {
                            arr.push(link);
                        }
                    });
                    return arr;
                })
                .enter().append('svg:circle')
                .attr('class', 'pulseDot')
                .attr('r', _this.options.nodeRadius.pulse)
                .style('fill', function (d, i) {
                    pulseFlags[i] = false;
                    return 'red';
                })
                .style('opacity', 0);
            return pulseDot;
        },
        _pulseHandle: function (pulseFlags, ele, r, delayTime) {  // 控制 脉冲的动画
            var _this = this;
            var nodeRadius = _this.options.nodeRadius;
            var _ele = d3.select(ele);
            _ele
                .attr('r', r)
                .transition()
                .delay(function () {
                    return delayTime === undefined ? 250 : delayTime;
                })
                .duration(2000)
                .ease('linear')
                .each('start', function (d) {
                    var posD = _this._calculateEndpointPos(d, -2 * nodeRadius.pulse, -2 * nodeRadius.pulse);
                    _ele.attr('cx', posD.sourceX)
                        .attr('cy', posD.sourceY)
                        .style('opacity', 1);
                })
                .attr('cx', function (d) {
                    var posD = _this._calculateEndpointPos(d, -2 * nodeRadius.pulse, -2 * nodeRadius.pulse);
                    return (pulseFlags[d.source.index] || pulseFlags[d.target.index]) ? posD.targetX : posD.sourceX;
                })
                .attr('cy', function (d) {
                    var posD = _this._calculateEndpointPos(d, -2 * nodeRadius.pulse, -2 * nodeRadius.pulse);
                    return (pulseFlags[d.source.index] || pulseFlags[d.target.index]) ? posD.targetY : posD.sourceY;
                })
                .each('end', function(d) {
                    if(pulseFlags[d.source.index] || pulseFlags[d.target.index]) _this._pulseHandle(pulseFlags, ele, r, 30);
                });
        },
        _scaleAndRefresh: function (zoomG) {  // 缩放刷新
            this.$wrapper.append('<div class="relation-operation" id="relation-operation-btns">' +
                '<i class="fa fa-search-plus relation-shadow" aria-hidden="true" id="relation-plus"></i>' +
                '<i class="fa fa-search-minus relation-shadow" aria-hidden="true" id="relation-minus"></i>' +
                '<i class="fa fa-refresh relation-shadow" aria-hidden="true" id="relation-refresh"></i>' +
                '</div>');

            var maxScale = 2,
                minScale = .8;
            var _this = this;
            $('#relation-plus').click(function () {
                var currGetSize = _this._getSize(zoomG);
                if(currGetSize.scale + 0.1 < maxScale) {
                    zoomG.attr("transform", "translate(" + currGetSize.width/2 + ", " + currGetSize.height/2 + ")translate(" + currGetSize.translate + ")scale(" + (currGetSize.scale + 0.1) + ")translate(-" + currGetSize.width/2 + ", -" + currGetSize.height/2 + ")");
                }
            });
            $('#relation-minus').click(function () {
                var currGetSize = _this._getSize(zoomG);
                console.log(currGetSize.scale)
                if(currGetSize.scale - 0.1 >= minScale) {
                    zoomG.attr("transform", "translate(" + currGetSize.width/2 + ", " + currGetSize.height/2 + ")translate(" + currGetSize.translate + ")scale(" + (currGetSize.scale - 0.1) + ")translate(-" + currGetSize.width/2 + ", -" + currGetSize.height/2 + ")");
                }
            });

            $('#relation-refresh').click(function () { // 过滤掉不符合条件的node及相应的link
                _this.init();
            });

        },
        _filterAndLegend: function (zoomG, link, linkText, node, pulseDot) {  // 图例、筛选功能
            var _this = this;
            if(_this.options.filter) {
                this.$wrapper.append('<ul class="relation-filter filter-container pull-right find-filter" id="relation-filter-wrapper"></ul>');
                d3.select('#relation-filter-wrapper')
                    .html('').selectAll("li")
                    .data((function() {
                        var arr = [];
                        for(var key in _this.options.allRelationTypeMap) {
                            if(_this.options.allRelationTypeMap[key].needShow) arr.push(key);
                        }
                        console.log(arr)
                        return arr;
                    })())
                    .enter()
                    .append("li")
                    .attr('class', 'filter-list')
                    .each(function (d) {
                        // create checkbox for each data
                        d3.select(this).append("span")
                            .attr("id", function (d) {
                                return "chk_" + _this.options.allRelationTypeMap[d].class;
                            })
                            .attr("class", function (d) {
                                return 'active filter-box chk_' + _this.options.allRelationTypeMap[d].class;
                            })
                            .on("click", function (d, i) {
                                // register on click event
                                var $this = $(this);
                                $this.toggleClass('active');
                                var lVisibility = $this.hasClass('active') ? "visible" : "hidden";
                                console.log(_this.options)
                                _this._filterGraph(_this.options.allRelationTypeMap[d].class, lVisibility, link, linkText, node, pulseDot);
                            })
                        d3.select(this).append("span")
                            .text(function (d) {
                                return d;
                            });
                    });
            }
            if(_this.options.legend) {
                this.$wrapper.append('<ul class="relation-legend legend-container pull-left find-legend" id="relation-legend-wrapper"></ul>');
                d3.select("#relation-legend-wrapper")
                    .html('').selectAll('li')
                    .data((function () {
                        var arr = [];
                        for(var key in _this.options.nodeTypeMap) {
                            arr.push(key);
                        }
                        return arr;
                    })())
                    .enter().append('li')
                    .attr('class', 'legend-list')
                    .each(function (d) {
                        var d3this = d3.select(this);
                        d3this.append('span')
                            .attr('class', function (d) {
                                return 'legend-circle leg_' + d;
                            });
                        d3this.append('span')
                            .text(function () {
                                return _this.options.nodeTypeMap[d][2];
                            });
                    })
            }
        },
        _filterGraph: function (aType, aVisibility, link, linkText, node, pulseDot) {  // 操作筛选时，控制节点、关系线的展示、隐藏
            // change the visibility of the connection path
            link.style("visibility", function (o) {
                var lOriginalVisibility = $(this).css("visibility");
                return o.relationType === aType ? aVisibility : lOriginalVisibility;
            });

            linkText.style("visibility", function (o) {
                var lOriginalVisibility = $(this).css("visibility");
                return o.relationType === aType ? aVisibility : lOriginalVisibility;
            });
            pulseDot.style("visibility", function (o) {
                var lOriginalVisibility = $(this).css("visibility");
                return o.relationType === aType ? aVisibility : lOriginalVisibility;
            });
            // change the visibility of the node
            // if all the links with that node are invisibile, the node should also be invisible
            // otherwise if any link related to that node is visibile, the node should be visible
            node.style("visibility", function (o, i) {
                var lHideNode = true;
                link.each(function (d, m) {
                    if (d.source === o || d.target === o) {
                        if ($(this).css("visibility") === "visible") {
                            lHideNode = false;
                            // we need show the text for this circle
                            return "visible";
                        }
                    }
                });
                if (lHideNode) {
                    // we need hide the text for this circle
                    return "hidden";
                }
            });
        },
        _drawRelation: function () {  // 整合 添加 svg等元素
            var _this = this;
            var force = this._initForce();
            var svg = this._appendSvg();
            var zoomG = this._appendZoomG(svg);

            this._defineMaker(zoomG);  // 定义箭头颜色
            this._defineGradient(zoomG);  // 定义节点渐变
            this._scaleAndRefresh(zoomG); // 放大、缩小、刷新

            this._zoom(zoomG);  // 移动 ?
            svg.call(this._pan(zoomG)); // 平移

            //画连线
            var link = this._appendLink(zoomG);
            // 画 关系线上的文字
            var linkText = this._appendLinkText(zoomG);

            if(this.options.pulse) { // 需要脉冲
                var pulseFlags = [];
                var pulseDot = this._appendPulse(zoomG, pulseFlags);

                $(document).click(function (ev) {
                    pulseFlags = [];  // have canceled bubble of the nodes' click event
                    pulseDot.style('opacity', 0);
                });
            }
            // 画节点（圆、公司名）
            var node = this._appendNode(zoomG);
            var tick = this._tick(link, linkText, node, pulseDot);

            this._filterAndLegend(zoomG, link, linkText, node, pulseDot);

            var isDraged,  // 防止每次 drag 节点触发 click 节点
                dx,
                dy;
            var node_drag = d3.behavior.drag()
                .on("dragstart", function(d, i) {
                    force.stop() // stops the force auto positioning before you start dragging
                    //pulseFlags[i] = false;
                    dx = d.x;
                    dy = d.y;
                })
                .on("drag", function(d, i) {
                    d.px += d3.event.dx;  //?
                    d.py += d3.event.dy; //?
                    d.x += d3.event.dx;
                    d.y += d3.event.dy;
                    tick(); // this is the key to make it work together with updating both px,py,x,y on d !
                    if(dx !== d.x || dy !== d.y) {
                        if(_this.options.pulse) {
                            pulseDot.style('opacity', 0);
                            pulseFlags[i] = false;
                        }
                        isDraged = true;
                    }
                })
                .on("dragend", function(d, i) {
                    d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
                    tick();
                    //force.resume();
                    if(_this.options.pulse) {
                        pulseDot.style('opacity', 0);
                        pulseFlags= [];
                    }
                    isDraged = (dx !== d.x || dy !== d.y);
                    if(_this.options.pulse) pulseFlags[i] = !isDraged;
                });


            node.call(node_drag);

            //节点
            node
                .on('mouseover', function (d, i) {
                    link
                        .attr('class', function (item, i) {
                            if(item.source === d || item.target === d) {
                                return 'link ' + item.relationType + ' active';
                            } else {
                                return 'link ' + item.relationType + ' opacity';
                            }
                        });
                    linkText
                        .filter(function (item) {
                            return item.source !== d && item.target !== d;
                        })
                        .attr('class', function () {
                            return 'linkText opacity';
                        });
                    //pulseDot.style('opacity', 0);
                    node.attr('class', function (item) {
                        if(item === d || item.upstream.some(function(el) {return el == i}) || item.downstream.some(function(el) {return el == i})) {
                            return 'node ' + item.nodeType +' active';
                        } else {
                            return 'node ' + item.nodeType +' opacity';
                        }

                    })
                })
                .on('mouseout', function (d, i) {
                    link
                        .attr('class', function (item) {
                            return 'link ' + item.relationType;
                        });
                    linkText
                        .attr('class', function (item) {
                            return 'linkText';
                        });
                    node.attr('class', function (item) {
                        return 'node ' + d.nodeType;
                    })
                })
                .on('click', function(d, i) {
                    d3.event.stopPropagation();   // cancel bubble of the nodes' click event
                    if (isDraged) return;
                    if (d.nodeType !== 'person') _this.showNodeInfo(d.name);
                    if(!_this.options.pulse) return;
                    var pulseRadiusRange = [2, 6],
                        pulseRadiusJson = {},
                        pulseRadiusArr = [],
                        pulseFilterArr = [];
                    pulseDot.each(function(item) {
                        if(item.source === d || item.target === d) {
                            if(!pulseRadiusJson[item.amount]) {
                                pulseRadiusJson[item.amount] = item.amout;
                                pulseRadiusArr.push(item.amount);
                            }

                            pulseFilterArr.push(item);
                        }
                    });
                    pulseRadiusArr.sort();
                    var pulseRadiusStep = (pulseRadiusRange[1] - pulseRadiusRange[0]) / Math.min(40, pulseRadiusArr.length);

                    pulseDot.each(function (item) {
                        if(item.source == d || item.target == d) {
                            for(var i = 0; i < pulseRadiusArr.length; i++) {
                                if(pulseRadiusArr[i] === item.amount) {
                                    var r = Math.max(pulseRadiusRange[1] - (pulseRadiusArr.length - 1 - i) * pulseRadiusStep, pulseRadiusRange[0]);
                                    // TODO
                                    //_this._pulseHandle(pulseFlags, this, r);
                                    pulseHandle(this, r);

                                }
                            }
                        }
                    })
                });

            function pulseHandle(ele, r, delayTime) {
                var nodeRadius = _this.options.nodeRadius;
                var _ele = d3.select(ele);
                _ele
                    .attr('r', r)
                    .transition()
                    .delay(function () {
                        return delayTime === undefined ? 250 : delayTime;
                    })
                    .duration(2000)
                    .ease('linear')
                    .each('start', function (d) {
                        var posD = _this._calculateEndpointPos(d, -2 * nodeRadius.pulse, -2 * nodeRadius.pulse);
                        _ele.attr('cx', posD.sourceX)
                            .attr('cy', posD.sourceY)
                            .style('opacity', 1);
                    })
                    .attr('cx', function (d) {
                        var posD = _this._calculateEndpointPos(d, -2 * nodeRadius.pulse, -2 * nodeRadius.pulse);
                        return (pulseFlags[d.source.index] || pulseFlags[d.target.index]) ? posD.targetX : posD.sourceX;
                    })
                    .attr('cy', function (d) {
                        var posD = _this._calculateEndpointPos(d, -2 * nodeRadius.pulse, -2 * nodeRadius.pulse);
                        return (pulseFlags[d.source.index] || pulseFlags[d.target.index]) ? posD.targetY : posD.sourceY;
                    })
                    .each('end', function(d) {
                        if(pulseFlags[d.source.index] || pulseFlags[d.target.index]) pulseHandle(ele, r, 30);
                    });
            }

            force.on("tick", tick)
                .start()
                .alpha(0.02);
        },
        init: function () {
            this._formatData();
            //console.log(this.data);
            this._drawRelation();

        },
        showNodeInfo: function (companyName, isHide) {  // 点击节点时被触发的事件
            // TODO
            //console.log(name);
            // var relationNodeInfo = $('#relation-node-info');
            // if(isHide) {
            //     relationNodeInfo.hide();
            // } else {
            //     relationNodeInfo.show(500);
            //     $('#relation-node-info h3 a').text(companyName).attr('title',companyName);
            //     $.ajax({//获得ID
            //         url: "/wenchuang/search/getCompanyByName",
            //         type: 'GET',
            //         data: {companyName : companyName},
            //         cache: false,
            //         async: true,
            //         success: function(result) {
            //             if (result.code == gm.httpCode.ok) {
            //                 var items = result.data;
            //                 var companyId;
            //                 if(!!items && items[0]!==null) {
            //                     //无此公司，不能点击
            //                     if(!$('#relation-node-info h3 a').hasClass('view-company-info')){
            //                         $('#relation-node-info h3 a').addClass('view-company-info').css('cursor','pointer');
            //                     }
            //                     //company = result.data.items[0];
            //                     companyId = items;
            //                     $.ajax({
            //                         // TODO
            //                         url: "/wenchuang/search/companyDetailViaId",
            //                         //url: "/js/data/companyDetailViaId.json",
            //                         type: 'GET',
            //                         data: {id : companyId},
            //                         cache: false,
            //                         async: true,
            //                         success: function(result) {
            //                             if (result.code == gm.httpCode.ok) {
            //                                 var data = result.data;
            //                                 $('#find-man').empty();
            //                                 $('#findManList').tmpl(data.companyBaseInfo).appendTo('#find-man');
            //                                 //$('#find-man')
            //                                 //    .html(data.companyBaseInfo.legalPersonName)
            //                                 //    .attr('title',data.companyBaseInfo.legalPersonName).addClass('find-width-set');
            //                                 $('#find-company-status').text(data.companyBaseInfo.regStatus);
            //                                 $('#find-money').html(data.companyBaseInfo.regCapital);
            //                                 $('#find-date').html(data.companyBaseInfo.estiblishTime);
            //                                 if(data.companyInvestorList.length){//股东
            //                                     $('#find-partner').empty();
            //                                     $('#findInvestorList').tmpl(data.companyInvestorList).appendTo('#find-partner');
            //                                 }else{
            //                                     $('#find-partner').html('<div class="find-list"><span class=" pl5">暂无数据</span></div>');
            //                                 }
            //                                 if(data.companyInvestList.length){//对外投资
            //                                     $('#find-investment').empty();
            //                                     $('#findInvestList').tmpl(data.companyInvestList).appendTo('#find-investment');
            //                                 }else{
            //                                     $('#find-investment').html('<div class="find-list"><span class=" pl5">暂无数据</span></div>');
            //                                 }

            //                                 for(var i = 0; i < data.companyStaffList.length; i++) {//主要人员
            //                                     data.companyStaffList[i].staffName = data.companyStaffList[i].staffName.replace(/\"/g, '');
            //                                 }

            //                                 if (data.companyStaffList.length){
            //                                     $('#find-key-personnel').empty();
            //                                     $('#findStaffList').tmpl(data.companyStaffList).appendTo('#find-key-personnel');
            //                                 }else{
            //                                     $('#find-key-personnel').html('<div class="find-list"><span class=" pl5">暂无数据</span></div>');
            //                                 }
            //                                 if(data.companyBranchList.length){
            //                                     $('#find-branch').empty();
            //                                     $('#findBranchList').tmpl(data.companyBranchList).appendTo('#find-branch');//分支机构
            //                                 }else{
            //                                     $('#find-branch').html('<div class="find-list"><span class=" pl5">暂无数据</span></div>');
            //                                 }
            //                                 $('#find-company-status').show();
            //                                 $('#find-info-default').show();
            //                                 $('#find-info-none').hide();
            //                             } else if (result.code == gm.httpCode.username_not_login) {
            //                                 window.location.href = gm.page.login;
            //                             } else {
            //                                 gm.alert({
            //                                     content: result.message
            //                                 });
            //                             }
            //                         },
            //                         error: function () {
            //                             $('#myLoading').hide();
            //                             gm.alert({
            //                                 content: '部分数据加载失败，可能会导致页面显示异常，请刷新后重试'
            //                             })
            //                         }
            //                     });
            //                 }else{
            //                     $('#relation-node-info h3 a').removeClass('view-company-info').css('cursor','default');
            //                     $('#find-company-status').hide();
            //                     $('#find-info-default').hide();
            //                     $('#find-info-none').show();
            //                 }
            //             } else if (result.code == gm.httpCode.username_not_login) {
            //                 window.location.href = gm.page.login;
            //             } else {
            //                 gm.alert({
            //                     content: result.message
            //                 });
            //             }
            //         }
            //     });
            //     $('.find-close .close').click(function(){
            //         relationNodeInfo.hide();
            //     })
            // }
        }
    }
})(window);